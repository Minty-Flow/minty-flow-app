import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemplate = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M19 3a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" />
    <Path d="M9 11a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2z" />
    <Path d="M20 11a1 1 0 0 1 0 2h-6a1 1 0 0 1 0 -2z" />
    <Path d="M20 15a1 1 0 0 1 0 2h-6a1 1 0 0 1 0 -2z" />
    <Path d="M20 19a1 1 0 0 1 0 2h-6a1 1 0 0 1 0 -2z" />
  </Svg>
);
export default SvgTemplate;
