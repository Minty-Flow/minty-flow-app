import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBinaryTree2 = (props: SvgProps) => (
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
    <Path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M7 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M21 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M12 8v8" />
    <Path d="M6.316 12.496l4.368 -4.992" />
    <Path d="M17.684 12.496l-4.366 -4.99" />
  </Svg>
);
export default SvgBinaryTree2;
