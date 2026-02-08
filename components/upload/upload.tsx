"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadProvider, useUpload } from "./upload-context";

export function UploadRoot( {
  children,
  className,
  ...props
}: React.ComponentProps<"div"> ) {
  return (
    <UploadProvider>
      <div className={ cn( "space-y-6", className ) } { ...props }>
        { children }
      </div>
    </UploadProvider>
  );
}

export function UploadDropzone( {
  className,
  ...props
}: React.ComponentProps<"button"> ) {
  const { addFiles } = useUpload();
  const inputRef = useRef<HTMLInputElement>( null );

  const handleChange = useCallback(
    ( e: React.ChangeEvent<HTMLInputElement> ) => {
      const chosen = e.target.files;
      if ( chosen?.length ) {
        addFiles( Array.from( chosen ) );
      }
      e.target.value = "";
    },
    [ addFiles ]
  );

  const handleDrop = useCallback(
    ( e: React.DragEvent ) => {
      e.preventDefault();
      const items = e.dataTransfer.files;
      if ( items?.length ) {
        addFiles( Array.from( items ) );
      }
    },
    [ addFiles ]
  );

  const handleDragOver = useCallback( ( e: React.DragEvent ) => {
    e.preventDefault();
  }, [] );

  return (
    <button
      aria-label="Upload product images. Drop files or click to browse. 3 to 6 JPG or PNG images required."
      className={ cn(
        "flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border border-dashed bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      ) }
      onClick={ () => inputRef.current?.click() }
      onDragOver={ handleDragOver }
      onDrop={ handleDrop }
      type="button"
      { ...props }
    >
      <input
        accept="image/jpeg,image/png"
        aria-hidden
        className="sr-only"
        multiple
        onChange={ handleChange }
        ref={ inputRef }
        type="file"
      />
      <p className="text-center font-medium text-foreground text-sm">
        Drop images here or click to browse
      </p>
      <p className="mt-1 text-center text-muted-foreground text-xs">
        3–6 JPG or PNG images from different angles
      </p>
    </button>
  );
}

export function UploadFileList( {
  className,
  ...props
}: React.ComponentProps<"ul"> ) {
  const { files } = useUpload();
  if ( files.length === 0 ) {
    return null;
  }
  return (
    <ul
      aria-label="Selected product images"
      className={ cn( "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className ) }
      { ...props }
    >
      { files.map( ( f ) => (
        <UploadFileItem file={ f } key={ f.id } />
      ) ) }
    </ul>
  );
}

function UploadFileItem( {
  file,
}: {
  file: { id: string; preview: string; file: File };
} ) {
  const { removeFile, moveFile, files } = useUpload();
  const index = files.findIndex( ( f ) => f.id === file.id );
  const canMoveUp = index > 0;
  const canMoveDown = index >= 0 && index < files.length - 1;

  return (
    <li
      className="group flex items-center gap-2 rounded-lg border border-border bg-card p-2"
      data-state="selected"
    >
      {/* biome-ignore lint/performance/noImgElement: Blob URL preview; next/image does not support object URLs */ }
      <img
        alt=""
        className="size-14 shrink-0 rounded-md object-cover"
        height={ 56 }
        src={ file.preview }
        width={ 56 }
      />
      <div className="min-w-0 flex-1 text-muted-foreground text-xs">
        { file.file.name }
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          aria-label="Move image up"
          disabled={ !canMoveUp }
          onClick={ () => moveFile( file.id, "up" ) }
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <ChevronUp className="size-4" />
        </Button>
        <Button
          aria-label="Move image down"
          disabled={ !canMoveDown }
          onClick={ () => moveFile( file.id, "down" ) }
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <ChevronDown className="size-4" />
        </Button>
        <Button
          aria-label="Remove image"
          onClick={ () => removeFile( file.id ) }
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </li>
  );
}

export function UploadValidation( {
  className,
  ...props
}: React.ComponentProps<"div"> ) {
  const { validation } = useUpload();
  if ( validation.valid ) {
    return null;
  }
  return (
    <div
      aria-live="polite"
      className={ cn(
        "rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm",
        className
      ) }
      role="alert"
      { ...props }
    >
      { validation.message }
    </div>
  );
}

export function UploadTrigger( {
  className,
  children,
  ...props
}: React.ComponentProps<"button"> ) {
  const { validation } = useUpload();
  return (
    <Button
      className={ cn( className ) }
      disabled={ !validation.valid }
      type="submit"
      { ...props }
    >
      { children ?? "Create 3D model" }
    </Button>
  );
}
