import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCreditCardHand = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M2 4h9.914a3 3 0 0 1 1.92 .695l5.166 4.305" />
    <Path d="M11.15 9h8.85a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-13a2 2 0 0 1 -2 -2v-8.7" />
    <Path d="M3 8l7.2 4.7a1.803 1.803 0 0 0 2 -3l-4.2 -2.7" />
    <Path d="M5 16h17" />
  </Svg>
);
export default SvgCreditCardHand;
