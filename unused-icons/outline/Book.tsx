import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBook = (props: SvgProps) => (
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
    <Path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <Path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <Path d="M3 6l0 13" />
    <Path d="M12 6l0 13" />
    <Path d="M21 6l0 13" />
  </Svg>
);
export default SvgBook;
