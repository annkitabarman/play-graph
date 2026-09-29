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
      left: 20,
    };

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    const container = svg.append("g");

    // X scale
    const x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.genre))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    // Y scale
    const maxPlaytime = d3.max(data, (d) => d.playtimeMinutes) ?? 0;

    const chartPadding = 12;

    const y = d3
      .scaleLinear()
      .domain([0, maxPlaytime])
      .nice()
      .range([
        height - margin.bottom - chartPadding,
        margin.top + chartPadding,
      ]);

    // Chart border
    container
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "none")
      .attr("stroke", "#3a3655")
      .attr("stroke-width", 1)
      .attr("rx", 4);

    // Horizontal grid lines
    const yGrid = d3
      .axisLeft(y)
      .ticks(4)
      .tickSize(-(width - margin.left - margin.right))
      .tickFormat(() => "");

    container
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yGrid)
      .call((g) => {
        g.select(".domain").remove();

        g.selectAll(".tick line")
          .attr("stroke", "#2a2748")
          .attr("stroke-dasharray", "2 3");
      });

    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "genre-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#8b5cf6");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ec4899");

    // Bars
    container
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.genre)!)
      .attr("y", (d) => y(d.playtimeMinutes))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.playtimeMinutes))
      .attr("rx", 6)
      .attr("fill", "url(#genre-gradient)")
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
    const hoursLabels = container
      .selectAll(".hours-label")
      .data(data)
      .join("g")
      .attr("class", "hours-label")
      .attr(
        "transform",
        (d) =>
          `translate(${x(d.genre)! + x.bandwidth() / 2}, ${
            y(d.playtimeMinutes) - 8
          })`,
      );

    hoursLabels
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#ffffff")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text((d) => `${(d.playtimeMinutes / 60).toFixed(1)}h`);

    hoursLabels.each(function () {
      const group = d3.select(this);
      const text = group.select("text").node() as SVGTextElement | null;

      if (!text) return;

      const bbox = text.getBBox();

      group
        .insert("rect", "text")
        .attr("x", bbox.x - 6)
        .attr("y", bbox.y - 3)
        .attr("width", bbox.width + 12)
        .attr("height", bbox.height + 6)
        .attr("rx", 6)
        .attr("fill", "#171238")
        .attr("stroke", "#3a3655")
        .attr("stroke-width", 1);
    });
  }, [data]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="h-auto w-full" />
    </div>
  );
}
