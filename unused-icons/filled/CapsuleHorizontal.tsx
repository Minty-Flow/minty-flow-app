import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCapsuleHorizontal = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M15 5h-6a7 7 0 1 0 0 14h6a7 7 0 0 0 7 -7l-.007 -.303a7 7 0 0 0 -6.993 -6.697z" />
  </Svg>
);
export default SvgCapsuleHorizontal;
