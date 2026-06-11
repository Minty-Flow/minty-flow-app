import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandNexo = (props: SvgProps) => (
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
    <Path d="M17 3l5 3v12l-5 3l-10 -6v-6l10 6v-6l-5 -3l5 -3" />
    <Path d="M12 6l-5 -3l-5 3v12l5 3l4.7 -3.13" />
  </Svg>
);
export default SvgBrandNexo;
