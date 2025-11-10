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
        d="M2 21v-1h18v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1M20 8h-2V5h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1m-2 11a4 4 0 0 1-4-4V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a4 4 0 0 1-4 4v.5c0 .18 0 .35-.03.5zm-2-9V6H4v4a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4m-1-6H3a1 1 0 0 1-1-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1a1 1 0 0 1-1 1"
      ></path>
    </svg>
  );
}
