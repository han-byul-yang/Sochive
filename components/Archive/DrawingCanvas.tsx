import { penStyles, makeDoubleLinePath } from "@/utils/penStyles";
import { Group, BlurMask, Path } from "@shopify/react-native-skia";

interface DrawingCanvasProps {
  path: any;
  index: number;
}

export default function DrawingCanvas({path, index}: DrawingCanvasProps) {
  return (
    <Group key={index}>
                  {penStyles[path.selectedTool as keyof typeof penStyles].path === "blur" ?
                    <>
                    <BlurMask blur={penStyles[path.selectedTool as keyof typeof penStyles].blur} style={penStyles[path.selectedTool as keyof typeof penStyles].option}/>
                  <Path
                    path={path.selectedTool === "doubleLine" ? makeDoubleLinePath(path.currentPath) :  penStyles[path.selectedTool as keyof typeof penStyles].style(path.currentPath)}
                    strokeWidth={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? path.strokeWidth * (penStyles[path.selectedTool as keyof typeof penStyles].width1) : path.strokeWidth}
                    blendMode={path.isEraser ? "dstOut" : "src"}
                    color={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? (penStyles[path.selectedTool as keyof typeof penStyles].color1 === 'selectedColor' ? path.color : penStyles[path.selectedTool as keyof typeof penStyles].color1) : path.color}
                    strokeJoin="round"
                    strokeCap={path.penTipStyle}
                    style="stroke"
                    opacity={path.opacity}
                    />
                    </>
                    :
                    <Group>
                    <Path
                    path={path.selectedTool === "doubleLine" ? makeDoubleLinePath(path.currentPath).path1 : penStyles[path.selectedTool as keyof typeof penStyles].style(path.currentPath)}
                    strokeWidth={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? path.strokeWidth * (penStyles[path.selectedTool as keyof typeof penStyles].width1) : path.strokeWidth}
                    blendMode={path.isEraser ? "dstOut" : "src"}
                    color={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? (penStyles[path.selectedTool as keyof typeof penStyles].color1 === 'selectedColor' ? path.color : penStyles[path.selectedTool as keyof typeof penStyles].color1) : path.color}
                    strokeJoin="round"
                    strokeCap={path.penTipStyle}
                    style="stroke"
                    opacity={path.opacity}
                  />
                  </Group>
              }
              {penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" &&
              <Group>
                  <Path
                    path={path.selectedTool === "doubleLine" ? makeDoubleLinePath(path.currentPath).path2 : penStyles[path.selectedTool as keyof typeof penStyles].style(path.currentPath)}
                    strokeWidth={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? path.strokeWidth * (penStyles[path.selectedTool as keyof typeof penStyles].width2) : path.strokeWidth}
                    blendMode={path.isEraser ? "dstOut" : "src"}
                    strokeJoin="round"
                    strokeCap={path.penTipStyle}
                    color={penStyles[path.selectedTool as keyof typeof penStyles].path === "path2" ? (penStyles[path.selectedTool as keyof typeof penStyles].color2 === 'selectedColor' ? path.color : penStyles[path.selectedTool as keyof typeof penStyles].color2) : path.color}
                    style="stroke"
                    opacity={path.opacity}
                  />
                   <BlurMask blur={3} style="solid" />
                  </Group>
              }
                </Group>
  );
}