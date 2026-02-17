import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import SponsoredCard from "@/components/SponsoredCard";
import { Briefcase, MapPin, GraduationCap, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface Job {
  id: string;
  title: string;
  title_en: string | null;
  company_name: string;
  company_name_en: string | null;
  location: string | null;
  location_en: string | null;
  qualification: string | null;
  qualification_en: string | null;
  job_type: string | null;
  salary: string | null;
  salary_en: string | null;
  last_date: string | null;
  apply_link: string | null;
  description: string | null;
  description_en: string | null;
  created_at: string;
}

const JobsPage = () => {
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterQualification, setFilterQualification] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (filterLocation) query = query.ilike("location", `%${filterLocation}%`);
      if (filterQualification) query = query.ilike("qualification", `%${filterQualification}%`);
      if (filterType) query = query.eq("job_type", filterType);

      const { data, count } = await query;
      setJobs((data as Job[]) ?? []);
      setTotalCount(count ?? 0);
      setLoading(false);
    };
    fetch();
  }, [page, filterLocation, filterQualification, filterType]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        {/* Banner */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6 mb-6 text-center">
          <Briefcase className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {language === "kn" ? "ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ಖಾಲಿ ಹುದ್ದೆಗಳು" : "Latest Job Vacancies"}
          </h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            placeholder={language === "kn" ? "ಸ್ಥಳ ಹುಡುಕಿ..." : "Filter by location..."}
            value={filterLocation}
            onChange={e => { setFilterLocation(e.target.value); setPage(1); }}
          />
          <input
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            placeholder={language === "kn" ? "ವಿದ್ಯಾರ್ಹತೆ..." : "Filter by qualification..."}
            value={filterQualification}
            onChange={e => { setFilterQualification(e.target.value); setPage(1); }}
          />
          <select
            className="border border-input rounded-md px-3 py-2 text-sm bg-background"
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
          >
            <option value="">{language === "kn" ? "ಎಲ್ಲಾ ಪ್ರಕಾರಗಳು" : "All Types"}</option>
            <option value="full-time">{language === "kn" ? "ಪೂರ್ಣ ಸಮಯ" : "Full Time"}</option>
            <option value="part-time">{language === "kn" ? "ಅರೆ ಸಮಯ" : "Part Time"}</option>
            <option value="contract">{language === "kn" ? "ಗುತ್ತಿಗೆ" : "Contract"}</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Job Listings */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                {language === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                {language === "kn" ? "ಉದ್ಯೋಗಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No jobs found"}
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-card-foreground">
                          {t(job.title, job.title_en)}
                        </h3>
                        <p className="text-sm font-medium text-primary mt-1">
                          {t(job.company_name, job.company_name_en)}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          {job.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t(job.location, job.location_en)}</span>
                          )}
                          {job.qualification && (
                            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {t(job.qualification, job.qualification_en)}</span>
                          )}
                          {job.salary && (
                            <span className="font-medium text-foreground">₹ {t(job.salary, job.salary_en)}</span>
                          )}
                          {job.last_date && (
                            <span className="flex items-center gap-1 text-destructive"><Calendar className="w-3.5 h-3.5" /> {language === "kn" ? "ಕೊನೆಯ ದಿನಾಂಕ:" : "Last date:"} {new Date(job.last_date).toLocaleDateString()}</span>
                          )}
                        </div>
                        {(job.description || job.description_en) && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{t(job.description, job.description_en)}</p>
                        )}
                      </div>
                      {job.apply_link && (
                        <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="whitespace-nowrap">
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            {language === "kn" ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "Apply"}
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && <PaginationItem><PaginationPrevious href="#" onClick={e => { e.preventDefault(); setPage(page - 1); }} /></PaginationItem>}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                      .map(p => (
                        <PaginationItem key={p}><PaginationLink href="#" isActive={p === page} onClick={e => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink></PaginationItem>
                      ))}
                    {page < totalPages && <PaginationItem><PaginationNext href="#" onClick={e => { e.preventDefault(); setPage(page + 1); }} /></PaginationItem>}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Right: Ad Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <SponsoredCard position="sidebar" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
