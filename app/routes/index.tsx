import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import Card from '~/components/Card';
import matchCards from '~/utils/matchCards';
import { getSession, commitSession, destroySession } from '../session';
import Navbar from '~/components/Navbar';
import Snap from '~/components/Snap';
import Results from '~/components/Results';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const deckId = url.searchParams.get('deckId');
  let session = await getSession(request.headers.get('Cookie'));

  // If there is a deckId in the query params, then we are returning it
  if (deckId) {
    let previousCard;
    let currentCard;
    let remainingCards;
    let valueMatchesCount;
    let suitMatchesCount;

    // If there is a previous card, then we are returning it along with the deckId
    if (session.has('previousCard')) {
      // console.log('previous card', session.get('previousCard'));
      previousCard = session.get('previousCard');
    }
    if (session.has('currentCard')) {
      // console.log('current card', session.get('currentCard'));
      currentCard = session.get('currentCard');
    }
    if (session.has('remainingCards')) {
      // console.log('remaining cards');
      remainingCards = session.get('remainingCards');
    }

    let suitMatches = matchCards(previousCard?.suit, currentCard?.suit);
    // console.log('suit matches', suitMatches);
    let valueMatches = matchCards(previousCard?.value, currentCard?.value);
    // console.log('value matches', valueMatches);

    if (session.has('valueMatchesCount')) {
      valueMatchesCount = session.get('valueMatchesCount');
    }

    if (session.has('suitMatchesCount')) {
      suitMatchesCount = session.get('suitMatchesCount');
    }

    return json(
      {
        deckId: deckId,
        previousCard: previousCard ?? null,
        currentCard: currentCard ?? null,
        remainingCards: remainingCards ?? null,
        suitMatches: suitMatches ?? null,
        valueMatches: valueMatches ?? null,
        valueMatchesCount: valueMatchesCount ?? 0,
        suitMatchesCount: suitMatchesCount ?? 0,
      },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  } else {
    // If there is no deckId in the query params, then we are fetching one from the deckofcardsapi and returning it
    const deck = await fetch(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    const deckData = await deck.json();
    return redirect(`/?deckId=${deckData.deck_id}`, {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const deckId = formData.get('deckId');

  // If there is a deckId on the formData, then we are fetching a card from the deckofcardsapi and returning it
  if (deckId) {
    const newCard = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    const newCardData = await newCard.json();

    // After we have the new have the newCardData, we need to get the session and check if there is a current card
    let session = await getSession(request.headers.get('Cookie'));

    // If there is a current card, then we are setting it as the previous card

    if (session.has('currentCard')) {
      session.set('previousCard', session.get('currentCard'));
    }

    // Then we are setting the new card as the current card

    session.set('currentCard', newCardData.cards[0]);
    session.set('remainingCards', newCardData.remaining);

    let previousCard = session.get('previousCard');
    let currentCard = newCardData.cards[0];

    let suitMatches = matchCards(previousCard?.suit, currentCard?.suit);
    let valueMatches = matchCards(previousCard?.value, currentCard?.value);

    if (suitMatches) {
      const oldMatchValue = session.get('suitMatchesCount') ?? 0;
      const newMatchValue = oldMatchValue + 1;

      session.set('suitMatchesCount', newMatchValue);
    }

    if (valueMatches) {
      const oldMatchValue = session.get('valueMatchesCount') ?? 0;
      const newMatchValue = oldMatchValue + 1;

      session.set('valueMatchesCount', newMatchValue);
    }

    return json(
      {
        newCardData,
      },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  }

  return {};
};

export const meta: MetaFunction = () => {
  return {
    title: 'Drivvn',
    description: 'Drivvn.',
  };
};

export default function Index() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const newCard =
    actionData?.newCardData?.cards[0]?.image || loaderData?.currentCard?.image;

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="w-full flex justify-end  p-4">
        <p className="text-xl" id="remaining-cards">
          Remaining cards: {loaderData?.remainingCards ?? 52}
        </p>
      </div>
      <Snap
        suitMatches={loaderData?.suitMatches}
        valueMatches={loaderData?.valueMatches}
      />

      <div className="flex w-full justify-center space-x-10 ">
        <div
          className="h-[480px] w-[360px] border border-black flex flex-col items-center"
          id="old-card-container"
        >
          {loaderData.previousCard && (
            <Card image={loaderData?.previousCard?.image} oldCard />
          )}
        </div>
        <div
          className="h-[480px] w-[360px] border border-black flex flex-col items-center"
          id="new-card-container"
        >
          {newCard && <Card image={newCard} />}
        </div>
      </div>

      <div className="flex flex-col items-center justify-cente py-20">
        {(loaderData.remainingCards > 0 ||
          loaderData.remainingCards === null) && (
          <div>
            <Form method="post">
              <input type="hidden" name="deckId" value={loaderData.deckId} />
              {loaderData.previousCard && (
                <input type="hidden" name="isPreviousCard" value="yes" />
              )}
              <button
                className="px-4 py-2 hover:bg-blue-500  bg-blue-400 active:bg-blue-700 text-white text-xl"
                type="submit"
              >
                Draw a card
              </button>
            </Form>
          </div>
        )}

        {loaderData.remainingCards === 0 && (
          <Results
            valueMatchesCount={loaderData?.valueMatchesCount}
            suitMatchesCount={loaderData?.suitMatchesCount}
          />
        )}
      </div>
    </div>
  );
}
