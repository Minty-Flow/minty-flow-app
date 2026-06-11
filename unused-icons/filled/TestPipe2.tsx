import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTestPipe2 = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M16 2a1 1 0 0 1 0 2v14a4 4 0 1 1 -8 0v-14a1 1 0 1 1 0 -2zm-2 2h-4v7h4z" />
  </Svg>
);
export default SvgTestPipe2;
