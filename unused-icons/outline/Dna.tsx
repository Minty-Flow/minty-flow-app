import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDna = (props: SvgProps) => (
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
    <Path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656" />
    <Path d="M9.172 20.485a4 4 0 1 0 -5.657 -5.657" />
    <Path d="M14.828 3.515a4 4 0 0 0 5.657 5.657" />
  </Svg>
);
export default SvgDna;
