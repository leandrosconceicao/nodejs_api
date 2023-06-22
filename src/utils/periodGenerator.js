class PeriodGenerator {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  buildQuery() {
    return { $gte: new Date(this.from), $lte: new Date(this.to) };
  }
}

export default PeriodGenerator;
