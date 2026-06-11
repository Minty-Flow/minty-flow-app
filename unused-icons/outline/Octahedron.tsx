import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOctahedron = (props: SvgProps) => (
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
    <Path d="M12.859 21.652l8.845 -8.949a.984 .984 0 0 0 0 -1.407l-8.845 -8.948a1.233 1.233 0 0 0 -1.718 0l-8.845 8.949a.984 .984 0 0 0 0 1.407l8.845 8.949a1.234 1.234 0 0 0 1.718 -.001" />
    <Path d="M2 12c.004 .086 .103 .178 .296 .246l8.845 2.632c.459 .163 1.259 .163 1.718 0l8.845 -2.632c.195 -.07 .294 -.156 .296 -.243" />
    <Path d="M12 2.12v19.76" />
  </Svg>
);
export default SvgOctahedron;
