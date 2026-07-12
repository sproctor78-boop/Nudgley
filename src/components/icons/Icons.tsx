import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...props };
}

export function MicIcon(props: IconProps) {
  return <svg {...base(props)}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
    <path d="M8.5 21h7" />
  </svg>;
}

export function PlusIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M12 5v14" /><path d="M5 12h14" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M4 12.5l5 5L20 6" /></svg>;
}

export function ClockIcon(props: IconProps) {
  return <svg {...base(props)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
}

export function SparkleIcon(props: IconProps) {
  return <svg {...base(props)}>
    <path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6-4.6-1.7 4.6-1.7z" />
    <path d="M19 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  </svg>;
}

export function MoreIcon(props: IconProps) {
  return <svg {...base(props)}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>;
}

export function ChevronDownIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M6 9l6 6 6-6" /></svg>;
}

export function ChevronRightIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M9 6l6 6-6 6" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>;
}

export function AlertIcon(props: IconProps) {
  return <svg {...base(props)}>
    <path d="M12 4.5l9 15.5H3z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="16.7" r=".6" fill="currentColor" stroke="none" />
  </svg>;
}
