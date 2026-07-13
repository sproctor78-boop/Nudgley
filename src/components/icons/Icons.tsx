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

export function SunIcon(props: IconProps) {
  return <svg {...base(props)}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </svg>;
}

export function WrenchIcon(props: IconProps) {
  return <svg {...base(props)}>
    <path d="M14.7 6.3a4 4 0 0 1-5.1 5.1L4 17l3 3 5.6-5.6a4 4 0 0 1 5.1-5.1l-2.6 2.6-2-2 2.6-2.6z" />
  </svg>;
}

export function BlockedIcon(props: IconProps) {
  return <svg {...base(props)}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M4 12h16M12 5v14" />
  </svg>;
}

export function CompassIcon(props: IconProps) {
  return <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M14.8 9.2l-2 4.6-4.6 2 2-4.6z" />
  </svg>;
}

export function MoonIcon(props: IconProps) {
  return <svg {...base(props)}><path d="M19 13.5A8 8 0 1 1 10.5 5a6.3 6.3 0 0 0 8.5 8.5z" /></svg>;
}

export function ChatIcon(props: IconProps) {
  return <svg {...base(props)}>
    <path d="M4 12a8 5.5 0 1 1 3.2 4.4L4 18l1.1-3.2A5.4 5.4 0 0 1 4 12z" />
  </svg>;
}
