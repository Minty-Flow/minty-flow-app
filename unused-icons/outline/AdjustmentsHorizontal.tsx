import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAdjustmentsHorizontal = (props: SvgProps) => (
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
    <Path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 6l8 0" />
    <Path d="M16 6l4 0" />
    <Path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 12l2 0" />
    <Path d="M10 12l10 0" />
    <Path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 18l11 0" />
    <Path d="M19 18l1 0" />
  </Svg>
);
export default SvgAdjustmentsHorizontal;
