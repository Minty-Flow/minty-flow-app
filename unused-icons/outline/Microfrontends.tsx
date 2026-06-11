import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicrofrontends = (props: SvgProps) => (
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
    <Path d="M7.5 7.5l4.5 4.5l4.5 -4.5" />
    <Path d="M6 16v-4" />
    <Path d="M18 16v-4" />
    <Path d="M16 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgMicrofrontends;
