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

    constructor(id) {
        this.id = id;
    }

    static ConstantCurve = new MastProfile("cc");
    static ConstantFlCurve = new MastProfile("cc-fl");
    static ConstantFhCurve = new MastProfile("cc-fh");
    static Unknown = new MastProfile("unknown");

    static profiles = [
        MastProfile.ConstantCurve,
        MastProfile.ConstantFlCurve,
        MastProfile.ConstantFhCurve,
        MastProfile.Unknown
    ].reduce(function(all,profile) {
            all[profile.id] = profile;
            return all;
        },
        {}
    );

    static getAll() {
        return Object.values(MastProfile.profiles);
    }
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

    constructor(selector) {
        this.elements = MastProfile.getAll().reduce(
            function(map, profile) {
                map[profile.id] = ProfileView.getProfileElement(profile);
                return map;
            },
            {}
        );
    }

    static getProfileElement(profile) {
        const id = "ums-" + profile.id;
        return document.getElementById(id);
    }

    show(profile) {
        if(!profile)
            profile = MastProfile.Unknown;
        for(const [id, element] of Object.entries(this.elements)) {
            element.style.display = id === profile.id ? "block" : "none";
        }
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

    constructor() {
        this.producerSelect = document.getElementById("ums-producer-select");
        this.yearSelect = document.getElementById("ums-year-select");
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

    constructor() {
        this.model = new SelectorModel();
        new SelectorBuilder(this.model.producerSelect)
            .appendAll(MastData.getAllProducers());
        new SelectorBuilder(this.model.yearSelect)
            .appendYears(2011, 2021);
        this.profileView = new ProfileView();
    }

    onChange() {
        const profile = this.model.resolveProfile();
        this.profileView.show(profile);
    }
};

var mastSelector;

window.onload = function() {
    mastSelector = new MastSelector();
    mastSelector.onChange();
};