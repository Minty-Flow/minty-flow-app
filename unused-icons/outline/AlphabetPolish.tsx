import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlphabetPolish = (props: SvgProps) => (
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
    <Path d="M7 10h2a2 2 0 0 1 2 2v5h-3a2 2 0 1 1 0 -4h3" />
    <Path d="M16 7v10" />
    <Path d="M18 11l-4 2" />
    <Path d="M10.5 17a1.5 1.5 0 0 0 0 3" />
  </Svg>
);
export default SvgAlphabetPolish;
