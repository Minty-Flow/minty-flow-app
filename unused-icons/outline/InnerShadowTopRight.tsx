import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInnerShadowTopRight = (props: SvgProps) => (
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
    <Path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18" />
    <Path d="M18 12a6 6 0 0 0 -6 -6" />
  </Svg>
);
export default SvgInnerShadowTopRight;
