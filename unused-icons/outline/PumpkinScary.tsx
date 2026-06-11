import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPumpkinScary = (props: SvgProps) => (
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
    <Path d="M9 15l1.5 1l1.5 -1l1.5 1l1.5 -1" />
    <Path d="M10 11h.01" />
    <Path d="M14 11h.01" />
    <Path d="M17 6.082c2.609 .588 3.627 4.162 2.723 7.983c-.903 3.82 -2.75 6.44 -5.359 5.853a3.355 3.355 0 0 1 -.774 -.279a3.728 3.728 0 0 1 -1.59 .361c-.556 0 -1.09 -.127 -1.59 -.362a3.296 3.296 0 0 1 -.774 .28c-2.609 .588 -4.456 -2.033 -5.36 -5.853c-.903 -3.82 .115 -7.395 2.724 -7.983c1.085 -.244 1.575 .066 2.585 .787c.716 -.554 1.54 -.869 2.415 -.869c.876 0 1.699 .315 2.415 .87c1.01 -.722 1.5 -1.032 2.585 -.788" />
    <Path d="M12 6c0 -1.226 .693 -2.346 1.789 -2.894l.211 -.106" />
  </Svg>
);
export default SvgPumpkinScary;
