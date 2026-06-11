import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCapsule = (props: SvgProps) => (
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
    <Path d="M6 9a6 6 0 0 1 6 -6a6 6 0 0 1 6 6v6a6 6 0 0 1 -6 6a6 6 0 0 1 -6 -6l0 -6" />
  </Svg>
);
export default SvgCapsule;
