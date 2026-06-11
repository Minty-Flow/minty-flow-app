import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandXamarin = (props: SvgProps) => (
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
    <Path d="M15.958 21h-7.917a2 2 0 0 1 -1.732 -1l-4.041 -7a2 2 0 0 1 0 -2l4.041 -7a2 2 0 0 1 1.732 -1h7.917a2 2 0 0 1 1.732 1l4.042 7a2 2 0 0 1 0 2l-4.041 7a2 2 0 0 1 -1.733 1" />
    <Path d="M15 16l-6 -8" />
    <Path d="M9 16l6 -8" />
  </Svg>
);
export default SvgBrandXamarin;
