import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgTaiwanDollar = (props: SvgProps) => (
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
    <Path d="M6 19a4 4 0 0 0 4 -4v-7" />
    <Path d="M14 8v10a1 1 0 0 0 1.45 .89l2.55 -1.27" />
    <Path d="M6 5h12" />
    <Path d="M6 8h12" />
  </Svg>
);
export default SvgTaiwanDollar;
