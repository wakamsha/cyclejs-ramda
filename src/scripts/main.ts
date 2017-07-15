import {Observable} from 'rxjs';
import {assoc} from 'ramda';
import {run} from '@cycle/rxjs-run';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {div, input, hr, h1, p, VNode, makeDOMDriver, CycleDOMEvent} from '@cycle/dom';
import {makeScrollDriver} from './drivers/makeScrollDriver';

type SoAll = {
    DOM: DOMSource;
}

type SiAll = {
    DOM: Observable<VNode>;
    Scroll: Observable<string>;
}

type PageState = {
    name: string;
    offsetTop: number;
}

function main({DOM, Scroll}: SoAll): SiAll {

    const inputName$: Observable<CycleDOMEvent> = DOM.select('.field').events('input');
    const inputScroll$: Observable<CycleDOMEvent> = DOM.select('.scrollable__input').events('input');

    const initialPageState: PageState = {
        name: '',
        offsetTop: 0
    };

    const pageState$ = Observable.merge(
        inputName$.map((ev: CycleDOMEvent) => assoc('name', (ev.ownerTarget as HTMLInputElement).value)),
        inputScroll$.map((ev: CycleDOMEvent) => assoc('scroll', Number((ev.ownerTarget as HTMLInputElement).value)))
    ).scan((acc, action) => action(acc), initialPageState).startWith(initialPageState);

    const dom$ = Observable.combineLatest(
        pageState$,
        Scroll.startWith('0px'),
        (pageState, scroll) => {
            return div('.container', [
                div('.row', [
                    div('.col-sm-8', [
                        div('.well', [
                            input('.field.form-control', {props: {
                                placeholder: '君の名は… !?',
                                value: pageState.name
                            }}),
                            hr(),
                            h1(`お前は… ${pageState.name} ${pageState.name && 'だ！'}`)
                        ])
                    ])
                ]),
                input('.scrollable__input.form-control', {
                    props: {
                        type: 'number',
                        value: pageState.offsetTop
                    }
                }),
                p('.scrollable__counter', scroll),
                div('.scroll-content')
            ]);
        }
    );

    return <SiAll>{
        DOM: dom$,
        Scroll: inputScroll$.map((ev: CycleDOMEvent) => Number((ev.ownerTarget as HTMLInputElement).value))
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    Scroll: makeScrollDriver({ element: document.body, duration: 600 })
};

run(main, drivers);
