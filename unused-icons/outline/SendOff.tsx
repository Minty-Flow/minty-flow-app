import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSendOff = (props: SvgProps) => (
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
    <Path d="M10 14l2 -2m2 -2l7 -7" />
    <Path d="M10.718 6.713l10.282 -3.713l-3.715 10.289m-1.063 2.941l-1.722 4.77a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l4.772 -1.723" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSendOff;
