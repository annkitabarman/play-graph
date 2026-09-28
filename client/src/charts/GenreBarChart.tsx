import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GenreData {
  genre: string;
  playtimeMinutes: number;
}

interface GenreBarChartProps {
  data: GenreData[];
}

export default function GenreBarChart({ data }: GenreBarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 250;

    const margin = {
      top: 25,
      right: 20,
      bottom: 65,
      left: 45,
    };

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    const container = svg.append("g");

    // X axis - genres
    const x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.genre))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    // Y axis - playtime
    const maxPlaytime = d3.max(data, (d) => d.playtimeMinutes) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([0, maxPlaytime])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Bars
    container
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.genre)!)
      .attr("y", (d) => y(d.playtimeMinutes))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.playtimeMinutes))
      .attr("rx", 6)
      .attr("fill", "#8b5cf6")
      .style("transition", "opacity 0.2s")
      .on("mouseenter", function () {
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseleave", function () {
        d3.select(this).style("opacity", 1);
      });

    // Genre labels
    container
      .selectAll(".genre-label")
      .data(data)
      .join("text")
      .attr("class", "genre-label")
      .attr("x", (d) => x(d.genre)! + x.bandwidth() / 2)
      .attr("y", height - margin.bottom + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#c4b5fd")
      .attr("font-size", "12px")
      .each(function (d) {
        const words = d.genre.split(" ");
        const text = d3.select(this);

        text.selectAll("tspan").remove();

        let line = "";
        let lineNumber = 0;
        const maxCharacters = 12;

        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;

          if (testLine.length > maxCharacters) {
            text
              .append("tspan")
              .attr("x", x(d.genre)! + x.bandwidth() / 2)
              .attr("dy", lineNumber === 0 ? 0 : "1.2em")
              .text(line);

            line = word;
            lineNumber++;
          } else {
            line = testLine;
          }
        }

        if (line) {
          text
            .append("tspan")
            .attr("x", x(d.genre)! + x.bandwidth() / 2)
            .attr("dy", lineNumber === 0 ? 0 : "1.2em")
            .text(line);
        }
      });

    // Hours above bars
    container
      .selectAll(".hours-label")
      .data(data)
      .join("text")
      .attr("class", "hours-label")
      .attr("x", (d) => x(d.genre)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.playtimeMinutes) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text((d) => `${(d.playtimeMinutes / 60).toFixed(1)}h`);
  }, [data]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="h-auto w-full" />
    </div>
  );
}
