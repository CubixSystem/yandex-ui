import { RefObject, useRef } from 'react';

import { VirtualElement } from './types';

export type VirtualElementRect = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export interface UseVirtualElementRefProps {
    /**
     * Положение виртуального элемента, относительно `viewport`
     */
    rect?: VirtualElementRect | null;

    /**
     * DOM-контекст виртуального элемента
     */
    contextElement?: Element;
}

const initialPosition = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Реакт-хук, позволяющий создать виртуальный элемент для попапа.
 */
export function useVirtualElementRef(props: UseVirtualElementRefProps = {}): RefObject<VirtualElement> {
    const { rect, contextElement } = props;
    const rectRef = useRef(initialPosition);

    const ref = useRef<VirtualElement>({
        contextElement,
        getBoundingClientRect() {
            const { top, right, bottom, left } = rectRef.current;
            const width = right - left;
            const height = bottom - top;

            return {
                top,
                right,
                bottom,
                left,
                width,
                height,
            };
        },
    });

    ref.current.contextElement = contextElement;

    if (rect) {
        const { top = 0, left = 0, right = left, bottom = top } = rect;

        rectRef.current = { top, right, bottom, left };
    } else {
        rectRef.current = initialPosition;
    }

    return ref;
}
