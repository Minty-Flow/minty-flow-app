import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandVisualStudio = (props: SvgProps) => (
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
    <Path d="M4 8l2 -1l10 13l4 -2v-12l-4 -2l-10 13l-2 -1l0 -8" />
  </Svg>
);
export default SvgBrandVisualStudio;
