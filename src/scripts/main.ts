import { Observable, combineLatest, merge } from './rxjs-import';
import { run } from '@cycle/rxjs-run';
import { DOMSource } from '@cycle/dom/rxjs-typings';
import { div, input, hr, h1, p, VNode, makeDOMDriver, CycleDOMEvent, code } from '@cycle/dom';
import { makeScrollDriver } from './drivers/makeScrollDriver';
import {
    initialMainState,
    MainState,
    MainStateAction,
    makeUpdateNameAction,
    makeUpdateOffsetTopAction,
} from './MainState';

type SoAll = {
    DOM: DOMSource;
    Scroll: Observable<string>;
};

type SiAll = {
    DOM: Observable<VNode>;
    Scroll: Observable<number>;
};

// prettier-ignore
function render({state, scroll}: {
    state: MainState;
    scroll: string;
}): VNode {
    return div('.container', [
        div('.row', [
            div('.col-sm-8', [
                div('.well', [
                    input('.field.form-control', {
                        props: {
                            placeholder: '君の名は… ',
                            value: state.name,
                        },
                    }),
                    hr(),
                    h1([`お前は… ${state.name} ${state.name && 'だ！'}`]),
                    div([
                        'baseUrl: ',
                        code([state.baseUrl])
                    ]),
                ]),
            ]),
        ]),
        input('.scrollable__input.form-control', {
            props: {
                type: 'number',
                value: state.offsetTop,
            },
        }),
        p('.scrollable__counter', [scroll]),
        div('.scroll-content'),
    ]);
}

function main({ DOM, Scroll }: SoAll): SiAll {
    const inputName$ = DOM.select('.field').events('input');
    const inputScroll$ = DOM.select('.scrollable__input').events('input');

    const state: Observable<MainState> = merge(
        inputName$.map((ev: CycleDOMEvent) => makeUpdateNameAction((ev.ownerTarget as HTMLInputElement).value)),
        inputScroll$.map((ev: CycleDOMEvent) =>
            makeUpdateOffsetTopAction(Number((ev.ownerTarget as HTMLInputElement).value)),
        ),
    )
        .scan((acc: MainState, action: MainStateAction) => action(acc), initialMainState)
        .startWith(initialMainState);

    const dom$ = combineLatest(state, Scroll.startWith('0px'), (state, scroll) => render({ state, scroll }));

    return {
        DOM: dom$,
        Scroll: inputScroll$.map((ev: CycleDOMEvent) => Number((ev.ownerTarget as HTMLInputElement).value)),
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    Scroll: makeScrollDriver({ element: document.body, duration: 600 }),
};

run(main, drivers);
