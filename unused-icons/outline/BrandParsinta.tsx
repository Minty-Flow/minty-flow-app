import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandParsinta = (props: SvgProps) => (
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
    <Path d="M12 3a9 9 0 1 0 9 9" />
    <Path d="M21 12a9 9 0 0 0 -9 -9" opacity={0.5} />
    <Path d="M10 9v6l5 -3l-5 -3" />
  </Svg>
);
export default SvgBrandParsinta;
