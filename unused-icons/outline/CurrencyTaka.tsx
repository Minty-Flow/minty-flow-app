import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyTaka = (props: SvgProps) => (
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
    <Path d="M15.5 15.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 7a2 2 0 1 1 4 0v9a3 3 0 0 0 6 0v-.5" />
    <Path d="M8 11h6" />
  </Svg>
);
export default SvgCurrencyTaka;
