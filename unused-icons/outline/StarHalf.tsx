import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStarHalf = (props: SvgProps) => (
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
    <Path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l.007 15.748" />
  </Svg>
);
export default SvgStarHalf;
