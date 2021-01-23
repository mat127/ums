class MastDataBuilder {

    constructor() {
        this.data = {};
    }

    add(firstYear, lastYear, profile) {
        for(let year = firstYear; year <= lastYear; year++)
            this.data[year] = profile;
        return this;
    }

    build() {
        return this.data;
    }

    static build(firstYear, lastYear, profile) {
        return new MastDataBuilder()
            .add(firstYear, lastYear, profile)
            .build();
    }
}

class MastProfile {

    constructor(id,name) {
        this.id = id;
        this.name = name;
    }

    static ConstantCurve = new MastProfile("cc", "Constant Curve");
    static ConstantFlCurve = new MastProfile("cc-fl", "Constant FL Curve");
    static ConstantFhCurve = new MastProfile("cc-fh", "Constant FH Curve");
    static Unknown = new MastProfile("unknown", "Unknown");

    static all = [
        MastProfile.ConstantCurve,
        MastProfile.ConstantFlCurve,
        MastProfile.ConstantFhCurve,
        MastProfile.Unknown
    ];
}

const MastData = {

    getAllProducers: function() {
        return Object.keys(this.data);
    },

    getProfile: function(producer, year) {
        return this.data[producer][year];
    },

    data: {
        "Aerotech": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Attitude Sails": MastDataBuilder.build(2014,2018,MastProfile.ConstantFhCurve),
        "Avanti Sails": MastDataBuilder.build(2013,2021,MastProfile.ConstantCurve),
        "Bull Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Challenger Sails": MastDataBuilder.build(2012,2021,MastProfile.ConstantFlCurve),
        "Duotone": MastDataBuilder.build(2019,2021,MastProfile.ConstantFlCurve),
        "Ezzy Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "GA / Gaastra": new MastDataBuilder()
            .add(2011,2014,MastProfile.ConstantCurve)
            .add(2015,2021,MastProfile.ConstantFlCurve)
            .build(),
        "Goya Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantFhCurve),
        "Gun Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Hot Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantFhCurve),
        "KA Sail": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Loft Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantFlCurve),
        "Maui Sails": MastDataBuilder.build(2011,2018,MastProfile.ConstantCurve),
        "Naish": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Neil Pryde":  new MastDataBuilder()
            .add(2011,2019,MastProfile.ConstantFhCurve)
            .add(2020,2021,MastProfile.ConstantCurve)
            .build(),
        "North Sails":  new MastDataBuilder()
            .add(2011,2013,MastProfile.ConstantCurve)
            .add(2014,2018,MastProfile.ConstantFlCurve)
            .build(),
        "Point-7 <=460": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Point-7 >=490": MastDataBuilder.build(2011,2021,MastProfile.ConstantFlCurve),
        "RRD": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "S2 Maui": MastDataBuilder.build(2017,2021,MastProfile.ConstantCurve),
        "Sailoft": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Sailworks": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Severne": MastDataBuilder.build(2011,2021,MastProfile.ConstantCurve),
        "Simmer Style": MastDataBuilder.build(2011,2021,MastProfile.ConstantFlCurve),
        "Vandal Sails": MastDataBuilder.build(2015,2018,MastProfile.ConstantCurve),
        "XO Sails": MastDataBuilder.build(2011,2021,MastProfile.ConstantFlCurve)
    }
};

class ProfileView {

    constructor(parent) {
        this.output = parent.getElementsByTagName("output")[0];
    }

    show(profile) {
        if(!profile)
            profile = MastProfile.Unknown;
        this.output.innerHTML = profile.name;
        this.output.className = ProfileView.getClassName(profile);
    }

    static getClassName(profile) {
        return "ums-profile ums-" + profile.id;
    }
}

class SelectorBuilder {

    constructor(select) {
        this.select = select;
    }

    append(value) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.innerHTML = value;
        this.select.appendChild(opt);
    }

    appendAll(data) {
        data.forEach(item => this.append(item));
    }

    appendYears(first,last) {
        for (let year = first; year <= last; year++)
            this.append(year);
    }
}

class SelectorModel {

    constructor(parent) {
        let select = parent.getElementsByTagName("select");
        this.producerSelect = select[0];
        this.yearSelect = select[1];
    }

    getSelectedProducer() {
        return this.producerSelect.selectedOptions[0].value;
    }

    getSelectedYear() {
        return this.yearSelect.selectedOptions[0].value;
    }

    resolveProfile() {
        const producer = this.getSelectedProducer();
        const year = this.getSelectedYear();
        return MastData.getProfile(producer, year);
    }
}

class MastSelector {

    constructor(parent) {
        this.model = new SelectorModel(parent);
        this.setupForm();
        this.profileView = new ProfileView(parent);
    }

    setupForm() {
        const onChange = () => this.onChange();
        new SelectorBuilder(this.model.producerSelect)
            .appendAll(MastData.getAllProducers());
        this.model.producerSelect.onchange = onChange;
        new SelectorBuilder(this.model.yearSelect)
            .appendYears(2011, 2021);
        this.model.yearSelect.onchange = onChange;
    }

    static build(parentId) {
        const form = MastSelector.buildForm(parentId);
        if(!form)
            return;
        const selector = new MastSelector(form);
        selector.onChange();
        return selector;
    }

    static buildForm(parentId) {
        const parent = document.getElementById(parentId);
        if(!parent) {
            console.log("parent having id: " + parentId + " not found.");
            return;
        }
        parent.innerHTML = `
          <form>
            <label for="producer" class="ums-label">Producer:</label>
            <select name="producer" id="producer" class="ums-select">
            </select>
            <label for="year" class="ums-label">Year:</label>
            <select name="year" id="year" class="ums-select">
            </select>
            <label for="profile" class="ums-label">Profile:</label>
            <output name="profile" id="profile" class="ums-profile ums-unknown">Unknown</output>
          </form>
        `;
        return parent.getElementsByTagName("form")[0];
    }

    onChange() {
        const profile = this.model.resolveProfile();
        this.profileView.show(profile);
    }
};