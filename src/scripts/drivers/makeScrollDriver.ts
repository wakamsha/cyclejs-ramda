import {Subject, Observable} from 'rxjs';
import {Stream} from 'xstream';

export function makeScrollDriver({element, duration}: {element: HTMLElement, duration: number}) {
    return function ScrollDriver(offsetTop$: Stream<number>): Subject<string> {
        const source = new Subject();

        const scrollTo = ({element, to, duration = 0}: {element: HTMLElement, to: number, duration: number}) => {
            if (duration <= 0) return;
            const difference = to - element.scrollTop;
            const perTick = difference / duration * 10;
            setTimeout(() => {
                element.scrollTop = element.scrollTop + perTick;
                if (element.scrollTop === to) return;
                scrollTo({element, to, duration: duration - 10});
            });
        };

        window.addEventListener('scroll', () => {
            source.next(`${window.scrollY} px`);
        });

        Observable.from(offsetTop$)
            .subscribe(
                (offsetTop: number) => scrollTo({element, to: offsetTop, duration})
            );
        return source;
    }
}
