import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandBebo = (props: SvgProps) => (
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
    <Path d="M12 17.5a3.5 3.5 0 0 0 3.5 -3.5c0 -1.838 -1.159 -3.002 -3.005 -3.372c-.746 -.15 -1.37 -.745 -1.37 -1.506c0 -1.142 .934 -2.095 2.058 -1.894c3.61 .645 5.817 3.058 5.817 6.772a7 7 0 1 1 -14 0v-9.25a1.75 1.75 0 1 1 3.5 0v9.25a3.5 3.5 0 0 0 3.5 3.5" />
  </Svg>
);
export default SvgBrandBebo;
