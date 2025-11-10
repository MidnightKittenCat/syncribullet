import type { QwikIntrinsicElements } from '@builder.io/qwik';

export function CoffeeIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="M2 21v-2h18v2zm2-4v-3H3v-2l1-5h12l1 5v2h-1v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2m14.77-9.75L18.5 7a1.495 1.495 0 0 0 0-3A1.495 1.495 0 0 0 17 5.5c0 .46.21.88.55 1.16l.27.25a1 1 0 0 1 .35.76a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 .35-.76m-2.5-2.5L14 4.5a1.495 1.495 0 0 0 0-3A1.495 1.495 0 0 0 12.5 3c0 .46.21.88.55 1.16l.27.25a1 1 0 0 1 .35.76a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 .35-.76m-2.5-2.5L9.5 2a1.495 1.495 0 0 0 0-3A1.495 1.495 0 0 0 8 .5c0 .46.21.88.55 1.16l.27.25a1 1 0 0 1 .35.76a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 .35-.76l.27-.25C8.21.38 8.42 0 8.42 0"
      ></path>
    </svg>
  );
}
