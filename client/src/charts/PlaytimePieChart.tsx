import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PlaytimeData {
  bucket: string;
  count: number;
}

interface PlaytimeChartProps {
  data: PlaytimeData[];
  totalGames: number;
}

const colors = ["#ec4899", "#22d3ee", "#a3ff12", "#8b5cf6", "#4c3f91"];

export default function PlaytimePieChart({
  data,
  totalGames,
}: PlaytimeChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);

    // Clear previous chart
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    const container = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // -----------------------------
    // Pie
    // -----------------------------

    const pie = d3
      .pie<PlaytimeData>()
      .value((d) => d.count)
      .sort(null);

    // -----------------------------
    // Donut
    // -----------------------------

    const arc = d3
      .arc<d3.PieArcDatum<PlaytimeData>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius - 25);

    // -----------------------------
    // Colors
    // -----------------------------

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.bucket))
      .range(colors);

    // -----------------------------
    // Draw donut
    // -----------------------------

    container
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.bucket))
      .attr("stroke", "#171238")
      .attr("stroke-width", 3)
      .style("transition", "opacity 0.2s")
      .on("mouseenter", function () {
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseleave", function () {
        d3.select(this).style("opacity", 1);
      });

    // -----------------------------
    // Center text
    // -----------------------------

    container
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .attr("fill", "#ffffff")
      .attr("font-size", "28px")
      .attr("font-weight", "700")
      .text(`${totalGames}`);

    container
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("fill", "#a78bfa")
      .attr("font-size", "14px")
      .text("total games");
  }, [data, totalGames]);

  return (
    <div className="w-full max-w-md">
      {/* Donut */}
      <svg ref={svgRef} />

      {/* List */}
      <div className="mt-2 space-y-2">
        {data.map((item, index) => {
          const percentage =
            totalGames > 0 ? Math.round((item.count / totalGames) * 100) : 0;

          const color = colors[index % colors.length];

          return (
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />

              <span className="w-20 shrink-0 truncate text-xs font-medium text-white">
                {item.bucket}
              </span>
              {/* 
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div> */}

              <span className="w-8 shrink-0 text-right text-xs text-white">
                {item.count}
              </span>

              <span className="w-8 shrink-0 text-right text-xs text-violet-300">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
