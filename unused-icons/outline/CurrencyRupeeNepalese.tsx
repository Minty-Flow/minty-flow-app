import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyRupeeNepalese = (props: SvgProps) => (
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
    <Path d="M15 5h-11h3a4 4 0 1 1 0 8h-3l6 6" />
    <Path d="M21 17l-4.586 -4.414a2 2 0 0 0 -2.828 2.828l.707 .707" />
  </Svg>
);
export default SvgCurrencyRupeeNepalese;
