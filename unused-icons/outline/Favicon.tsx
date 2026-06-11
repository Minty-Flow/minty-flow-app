import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFavicon = (props: SvgProps) => (
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
    <Path d="M2 8a3 3 0 0 1 3 -3h14a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3l0 -8" />
    <Path d="M6 10v4" />
    <Path d="M11 10a2 2 0 1 0 0 4" />
    <Path d="M14 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgFavicon;
