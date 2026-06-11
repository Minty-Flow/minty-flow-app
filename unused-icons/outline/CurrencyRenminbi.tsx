import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRenminbi = (props: SvgProps) => (
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
    <Path d="M15 9v8a2 2 0 1 0 4 0" />
    <Path d="M19 9h-14" />
    <Path d="M19 5h-14" />
    <Path d="M9 9v4c0 2.5 -.667 4 -2 6" />
  </Svg>
);
export default SvgCurrencyRenminbi;
