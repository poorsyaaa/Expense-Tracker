import { cn } from "@/lib/utils";
import {
  BeforeCapture,
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback } from "react";

interface DndContainerProps {
  children: React.ReactNode;
  onDragEnd?: (result: DropResult) => void;
  onDragStart?: (start: DragStart) => void;
  onDragUpdate?: (update: DragUpdate) => void;
  onBeforeDragStart?: (start: DragStart) => void;
  onBeforeCapture?: (before: BeforeCapture) => void;
  className?: string;
}

const DndContainer: React.FC<DndContainerProps> = ({
  children,
  onDragEnd,
  onDragStart,
  onDragUpdate,
  onBeforeDragStart,
  onBeforeCapture,
  className,
}) => {
  const onDragEndHandler = useCallback(
    (result: DropResult) => {
      if (onDragEnd) {
        onDragEnd(result);
      }
    },
    [onDragEnd],
  );

  const onDragStartHandler = useCallback(
    (start: DragStart) => {
      if (onDragStart) {
        onDragStart(start);
      }
    },
    [onDragStart],
  );

  const onDragUpdateHandler = useCallback(
    (update: DragUpdate) => {
      if (onDragUpdate) {
        onDragUpdate(update);
      }
    },
    [onDragUpdate],
  );

  const onBeforeDragStartHandler = useCallback(
    (start: DragStart) => {
      if (onBeforeDragStart) {
        onBeforeDragStart(start);
      }
    },
    [onBeforeDragStart],
  );

  const onBeforeCaptureHandler = useCallback(
    (before: BeforeCapture) => {
      if (onBeforeCapture) {
        onBeforeCapture(before);
      }
    },
    [onBeforeCapture],
  );

  return (
    <DragDropContext
      onDragEnd={onDragEndHandler}
      onDragUpdate={onDragUpdateHandler}
      onDragStart={onDragStartHandler}
      onBeforeDragStart={onBeforeDragStartHandler}
      onBeforeCapture={onBeforeCaptureHandler}
    >
      <div className={cn("p-4", className)}>{children}</div>
    </DragDropContext>
  );
};

export default DndContainer;
