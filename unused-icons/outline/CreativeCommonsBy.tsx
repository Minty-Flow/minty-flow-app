import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCreativeCommonsBy = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M11 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M9 13v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-.5l-.5 4h-2l-.5 -4h-.5a1 1 0 0 1 -1 -1" />
  </Svg>
);
export default SvgCreativeCommonsBy;
