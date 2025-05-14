"use client";

import {usePaginatedQuery} from "convex/react";

import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { api } from "../../../convex/_generated/api";
import { DocumentsTable } from "./documents-table";
import { useSearchParam } from "@/hooks/use-search-param";

const Home = () => {
  const [search] = useSearchParam();
  const {
    results, 
    status, 
    loadMore
  } = usePaginatedQuery(api.documents.get, {search}, {initialNumItems: 5});

  if (document === undefined) {
    return (
      <p>Загрузка...</p>
    )
  }

  return (
    <div className="min-b-screen flex flex-col bg-[#E6EEF7]">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-[#E6EEF7]" >
        <Navbar/>
      </div>
      <div className="mt-16">
      <TemplatesGallery/>
      <DocumentsTable
      documents={results}
      loadMore={loadMore}
      status={status}
      />
      </div>
    </div>
   );
}

export default Home;