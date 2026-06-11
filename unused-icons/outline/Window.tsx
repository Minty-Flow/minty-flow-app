import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindow = (props: SvgProps) => (
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
    <Path d="M12 3c-3.866 0 -7 3.272 -7 7v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-10c0 -3.728 -3.134 -7 -7 -7" />
    <Path d="M5 13l14 0" />
    <Path d="M12 3l0 18" />
  </Svg>
);
export default SvgWindow;
