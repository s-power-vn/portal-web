import type { PDFDocumentProxy } from 'pdfjs-dist';

import React, { FC, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { PDFViewer } from '@react-pdf/renderer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export type PdfViewProps = {
  content: string;
};

export const PdfView: FC<PdfViewProps> = props => {
  const frameRef = useRef<any>(null);
  const [source, setSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    // client
    //   .send('/create-pdf', {
    //     method: 'POST',
    //     body: {
    //       content: props.content
    //     }
    //   })
    //   .then(pdfFile => {
    //     const file = new Blob([pdfFile], { type: 'application/pdf' });
    //     const fileUrl = URL.createObjectURL(file);
    //     setSource(fileUrl);
    //   });
  }, [props.content]);

  const [numPages, setNumPages] = useState<number>();

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  return (
    <PDFViewer>
      <Document
        file={'https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf'}
        onLoadSuccess={onDocumentLoadSuccess}
        className={'overflow-auto'}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </PDFViewer>
  );
};
