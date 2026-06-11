import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIrregularPolyhedronPlus = (props: SvgProps) => (
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
    <Path d="M18 12l1.752 -6.13a1 1 0 0 0 -.592 -1.205l-6.282 -2.503a2.46 2.46 0 0 0 -1.756 0l-6.282 2.503a1 1 0 0 0 -.592 1.204l1.752 6.131l-1.752 6.13a1 1 0 0 0 .592 1.205l6.282 2.503a2.46 2.46 0 0 0 1.756 0l.221 -.088" />
    <Path d="M4.5 5.5l6.622 2.33a2.35 2.35 0 0 0 1.756 0l6.622 -2.33" />
    <Path d="M6 12l5.21 1.862a2.34 2.34 0 0 0 1.58 0l5.21 -1.862" />
    <Path d="M12 22v-14" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgIrregularPolyhedronPlus;
