import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSticker = (props: SvgProps) => (
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
    <Path d="M20 12l-2 .5a6 6 0 0 1 -6.5 -6.5l.5 -2l8 8" />
    <Path d="M20 12a8 8 0 1 1 -8 -8" />
  </Svg>
);
export default SvgSticker;
