import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMarkdown = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <Path d="M7 15v-6l2 2l2 -2v6" />
    <Path d="M14 13l2 2l2 -2m-2 2v-6" />
  </Svg>
);
export default SvgMarkdown;
