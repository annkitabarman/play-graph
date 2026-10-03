import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";
import { getDailyPlayTime } from "../apis/steam.api";
import * as d3 from "d3";

interface DailyPlayTimePoint {
  date: Date;
  minutes: number;
}

interface DailyPlayTimeResponse {
  days: DailyPlayTimePoint[];
}

export default function DailyPlayTimeChart() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const { data, isLoading, isError, error } = useQuery<DailyPlayTimeResponse>({
    queryKey: ["steam", "daily-play-time"],

    queryFn: () => getDailyPlayTime(getToken),

    enabled: isLoaded && isSignedIn,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data?.days?.length) {
      return;
    }

    const dailyData = data.days.map((d) => ({
      date: new Date(`${d.date}T00:00:00`),
      minutes: d.minutes,
    }));

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const width = 700;
    const height = 300;

    const margin = {
      top: 30,
      right: 30,
      bottom: 50,
      left: 60,
    };

    const innerWidth = width - margin.left - margin.right;

    const innerHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // -------------------------
    // X SCALE
    // -------------------------

    const x = d3
      .scaleTime()
      .domain(d3.extent(dailyData, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    // -------------------------
    // Y SCALE
    // -------------------------

    const maxMinutes = d3.max(dailyData, (d) => d.minutes) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(maxMinutes, 60)])
      .nice()
      .range([innerHeight, 0]);

    // -------------------------
    // GRID
    // -------------------------

    chart
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )
      .selectAll("line")
      .attr("stroke", "currentColor")
      .attr("opacity", 0.1);

    // -------------------------
    // X AXIS
    // -------------------------

    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(dailyData.length)
          .tickFormat((d) => d3.timeFormat("%b %d")(d as Date)),
      )
      .selectAll("text")
      .attr("fill", "currentColor");

    // -------------------------
    // Y AXIS
    // -------------------------

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", "currentColor");

    // -------------------------
    // LINE
    // -------------------------

    const line = d3
      .line<DailyPlayTimePoint>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.minutes))
      .curve(d3.curveMonotoneX);

    chart
      .append("path")
      .datum(dailyData)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 3)
      .attr("d", line);

    // -------------------------
    // POINTS
    // -------------------------

    const points = chart
      .selectAll<SVGCircleElement, DailyPlayTimePoint>(".point")
      .data(dailyData)
      .join("circle")
      .attr("class", "point")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.minutes))
      .attr("r", 5)
      .attr("fill", "#8b5cf6")
      .attr("stroke", "#171238")
      .attr("stroke-width", 2);

    // -------------------------
    // TOOLTIP
    // -------------------------

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "fixed")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("background", "#171238")
      .style("border", "1px solid rgba(139, 92, 246, 0.3)")
      .style("color", "white")
      .style("font-size", "12px")
      .style("z-index", "50");

    points
      .on("mouseenter", function (_, d) {
        d3.select(this).transition().duration(150).attr("r", 7);

        tooltip.style("opacity", 1).html(`
              <div>
                ${d3.timeFormat("%b %d")(d.date)}
              </div>

              <div style="font-weight: 600;">
                ${d.minutes} minutes
              </div>
            `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY - 30}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(150).attr("r", 5);

        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  if (!isLoaded) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-violet-300">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-violet-300">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-red-300">
        Failed to load daily playtime: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg ref={svgRef} className="h-auto w-full" viewBox="0 0 700 300" />

      <p className="mt-1 text-center text-sm font-medium tracking-wide text-violet-400">
        Minutes per day
      </p>
    </div>
  );
}
